import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const ControlPanel = ({isPanelOpen, handleReset}: {isPanelOpen: boolean, handleReset: () => void}) => {
  return (
        <div
          className={`
          fixed lg:relative inset-0 lg:inset-auto
          bg-background/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none
          z-40 lg:z-auto
          transition-transform duration-300 ease-in-out
          ${isPanelOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
        >
          <Card className="h-full lg:w-80 lg:m-4 lg:mr-8 p-6 overflow-y-auto rounded-none lg:rounded-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">編集パネル</h2>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                  リセット
                </Button>
              </div>
            </div>
          </Card>
        </div>
  )
}

export default ControlPanel